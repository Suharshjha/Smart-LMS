package com.example.LMS.Dto.Response;

public class RecommendationResponse {

    private Object data;
    private String message;

    public RecommendationResponse(Object data, String message) {
        this.data = data;
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
