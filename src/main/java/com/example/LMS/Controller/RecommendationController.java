//package com.example.LMS.Controller;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestClientException;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.http.client.SimpleClientHttpRequestFactory;
//
//@RestController
//@RequestMapping("/user")
//public class RecommendationController {
//
//    @Value("${ml.service.url}")
//    private String mlBaseUrl;
//
//    @GetMapping("/recommendations/{userId}")
//    public ResponseEntity<?> getRecommendations(@PathVariable int userId) {
//
//        try {
//            SimpleClientHttpRequestFactory factory =
//                    new SimpleClientHttpRequestFactory();
//            factory.setConnectTimeout(3000);
//            factory.setReadTimeout(5000);
//
//            RestTemplate restTemplate = new RestTemplate(factory);
//
//            Object response =
//                    restTemplate.getForObject(
//                            mlBaseUrl + userId,
//                            Object.class
//                    );
//
//            if (response == null) {
//                return ResponseEntity.ok(
//                        new MessageResponse(
//                                "Borrow more books to get personalized recommendations"
//                        )
//                );
//            }
//
//            return ResponseEntity.ok(response);
//
//        } catch (RestClientException e) {
//            e.printStackTrace();
//            return ResponseEntity.ok(
//                    new MessageResponse(
//                            "Recommendations are temporarily unavailable"
//                    )
//            );
//        }
//    }
//
//    // ✅ Simple response wrapper
//    static class MessageResponse {
//        public String message;
//
//        public MessageResponse(String message) {
//            this.message = message;
//        }
//    }
//}


@GetMapping("/recommendations/{userId}")
public ResponseEntity<?> getRecommendations(@PathVariable int userId) {

    try {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(5000);

        RestTemplate restTemplate = new RestTemplate(factory);

        Object response =
                restTemplate.getForObject(mlBaseUrl + userId, Object.class);

        if (response == null) {
            return ResponseEntity.ok(
                    new RecommendationResponse(
                            List.of(),
                            "Borrow more books to get personalized recommendations"
                    )
            );
        }

        return ResponseEntity.ok(
                new RecommendationResponse(response, null)
        );

    } catch (RestClientException e) {
        return ResponseEntity.ok(
                new RecommendationResponse(
                        List.of(),
                        "Recommendations are temporarily unavailable"
                )
        );
    }
}
