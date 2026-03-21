package com.srms.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class JWTUtil {

    private static final String SECRET = "srmsSecretKey";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    public static String generateToken(String username) {
        String header = Base64.getEncoder().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

        long expirationTime = System.currentTimeMillis() + EXPIRATION_TIME;
        String payload = Base64.getEncoder().encodeToString(
                ("{\"sub\":\"" + username + "\",\"iat\":" + System.currentTimeMillis() + ",\"exp\":" + expirationTime + "}")
                        .getBytes(StandardCharsets.UTF_8)
        );

        String signature = Base64.getEncoder().encodeToString(
                (header + "." + payload + SECRET).getBytes(StandardCharsets.UTF_8)
        );

        return header + "." + payload + "." + signature;
    }

    public static String validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }

            String payload = new String(Base64.getDecoder().decode(parts[1]), StandardCharsets.UTF_8);

            int expStart = payload.indexOf("\"exp\":") + 6;
            int expEnd = payload.indexOf(",", expStart);
            if (expEnd == -1) {
                expEnd = payload.indexOf("}", expStart);
            }
            long expirationTime = Long.parseLong(payload.substring(expStart, expEnd));

            if (System.currentTimeMillis() > expirationTime) {
                return null;
            }

            int subStart = payload.indexOf("\"sub\":\"") + 7;
            int subEnd = payload.indexOf("\"", subStart);
            return payload.substring(subStart, subEnd);

        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            return null;
        }
    }
}

