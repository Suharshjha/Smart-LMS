package com.example.LMS.Controller;

import com.example.LMS.Dto.Response.RecommendationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class RecommendationController {

    @Value("${ml.service.url}")
    private String mlBaseUrl;

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<RecommendationResponse> getRecommendations(
            @PathVariable int userId
    ) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            // 🔹 Raw ML response (snake_case)
            System.out.println("inside recom controller");
            System.out.println("Calling ML URL = " + mlBaseUrl + userId);
            List<Map<String, Object>> mlResponse =
                    restTemplate.getForObject(
                            mlBaseUrl + userId,
                            List.class
                    );


            System.out.println("response:"+ mlResponse);
            if (mlResponse == null || mlResponse.isEmpty()) {
                return ResponseEntity.ok(
                        new RecommendationResponse(
                                List.of(),
                                "Borrow more books to get personalized recommendations"
                        )
                );
            }

            // 🔥 Convert snake_case → camelCase
            List<Map<String, Object>> normalized = new ArrayList<>();

            for (Map<String, Object> b : mlResponse) {
                Map<String, Object> item = new HashMap<>();
                item.put("bookId", ((Number) b.get("book_id")).intValue());
                item.put("bookName", b.get("book_name"));
                item.put("authorName", b.get("author_name"));
                item.put("bookCategory", b.get("book_category"));
                normalized.add(item);
            }

            System.out.println(normalized);
            return ResponseEntity.ok(
                    new RecommendationResponse(
                            normalized,
                            "Recommendations fetched successfully"
                    )
            );


        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(
                    new RecommendationResponse(
                            List.of(),
                            "Recommendations are temporarily unavailable"
                    )
            );
        }
    }
}
