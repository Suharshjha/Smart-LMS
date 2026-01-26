import pandas as pd
from db import get_connection
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def load_data():
    conn = get_connection()

    books = pd.read_sql("SELECT book_id, book_name, author_name, book_category FROM books", conn)
    issued = pd.read_sql("SELECT user_id, book_id FROM issued_books WHERE status='APPROVED'", conn)

    conn.close()
    return books, issued

def content_based_recommendation(user_id, books, issued):
    user_books = issued[issued['user_id'] == user_id]['book_id'].tolist()
    if not user_books:
        return []

    books['content'] = (
        books['book_name'] + " " +
        books['author_name'] + " " +
        books['book_category']
    )

    tfidf = TfidfVectorizer(stop_words='english')
    matrix = tfidf.fit_transform(books['content'])

    similarity = cosine_similarity(matrix)

    indices = books.index[books['book_id'].isin(user_books)].tolist()

    scores = similarity[indices].mean(axis=0)

    books['score'] = scores
    recommendations = books[~books['book_id'].isin(user_books)]
    recommendations = recommendations.sort_values(by='score', ascending=False)

    return recommendations.head(5)


def collaborative_recommendation(user_id, books, issued):
    user_books = set(issued[issued['user_id'] == user_id]['book_id'])

    similar_users = issued[issued['book_id'].isin(user_books)]
    similar_users = similar_users['user_id'].unique()

    candidate_books = issued[
        issued['user_id'].isin(similar_users)
    ]['book_id']

    candidate_books = candidate_books[~candidate_books.isin(user_books)]

    popular = candidate_books.value_counts().head(5).index.tolist()
    return books[books['book_id'].isin(popular)]


def get_recommendations(user_id):
    books, issued = load_data()

    content = content_based_recommendation(user_id, books, issued)
    collab = collaborative_recommendation(user_id, books, issued)

    final = pd.concat([content, collab]).drop_duplicates('book_id')
    return final[['book_id', 'book_name', 'author_name', 'book_category']].head(5)

