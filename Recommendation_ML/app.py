from fastapi import FastAPI
from recommender import get_recommendations

app = FastAPI()

@app.get("/recommend/{user_id}")
def recommend(user_id: int):
    recs = get_recommendations(user_id)

    if recs.empty:
        return {
            "message": "Borrow more books to get personalized recommendations"
        }

    return recs.to_dict(orient="records")
