//package com.example.LMS.Controller;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/user")
//public class RecommendationController {
//
//
//    //    @Value("${ml.service.url:http://localhost:5000/recommend/}")
//    @Value("${ml.service.url}")
//    private String mlBaseUrl;
//
//    @GetMapping("/recommendations/{userId}")
//    public ResponseEntity<List<?>> getRecommendations(@PathVariable int userId) {
//        try {
//            System.out.println(mlBaseUrl);
//
//            RestTemplate restTemplate = new RestTemplate();
//
//            List<?> recommendations = restTemplate.getForObject(
//                    mlBaseUrl + userId,
//                    List.class
//            );
//
//            System.out.println(recommendations);
//            // ✅ ALWAYS return array
//            if (recommendations == null) {
//                return ResponseEntity.ok(List.of());
//            }
//
//            return ResponseEntity.ok(recommendations);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            // ✅ Fail-safe empty list
//            return ResponseEntity.ok(List.of());
//        }
//    }
//
//}
//


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

    @Value("${ml.service.url:http://localhost:5000/recommend/}")
    private String mlBaseUrl;

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<RecommendationResponse> getRecommendations(
            @PathVariable int userId
    ) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            // 🔹 Raw ML response (snake_case)
            List<Map<String, Object>> mlResponse =
                    restTemplate.getForObject(
                            mlBaseUrl + userId,
                            List.class
                    );

            System.out.println(mlResponse);
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
