//package com.example.LMS.Dto.Response;
//
//public class RecommendationResponse {
//
//    private Object data;
//    private String message;
//
//    public RecommendationResponse(Object data, String message) {
//        this.data = data;
//        this.message = message;
//    }
//
//    public Object getData() {
//        return data;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//}

package com.example.LMS.Dto.Response;

import java.util.List;
import java.util.Map;

public class RecommendationResponse {

    private List<Map<String, Object>> data;
    private String message;

    public RecommendationResponse(
            List<Map<String, Object>> data,
            String message
    ) {
        this.data = data;
        this.message = message;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
