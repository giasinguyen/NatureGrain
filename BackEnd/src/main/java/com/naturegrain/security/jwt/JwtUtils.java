package com.naturegrain.security.jwt;

import org.springframework.stereotype.Component;
import java.util.Date;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.util.WebUtils;

import com.naturegrain.security.service.UserDetailsImpl;

import io.jsonwebtoken.*;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwtSecret}")
    private String jwtSecret;
  
    @Value("${jwtExpirationMs}")
    private int jwtExpirationMs;
  
    @Value("${jwtCookieName}")
    private String jwtCookie;
  
    public String getJwtFromCookies(HttpServletRequest request) {
      Cookie cookie = WebUtils.getCookie(request, jwtCookie);
      if (cookie != null) {
        logger.debug("JWT cookie found: {}", jwtCookie);
        return cookie.getValue();
      } else {
        logger.debug("No JWT cookie found with name: {}", jwtCookie);
        return null;
      }
    }
  
    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
      String jwt = generateTokenFromUsername(userPrincipal.getUsername());
      // Cải thiện cấu hình cookie: thêm SameSite=Lax để hoạt động tốt hơn với cross-site
      ResponseCookie cookie = ResponseCookie.from(jwtCookie, jwt)
          .path("/") // Đặt path thành "/" thay vì "/api" để cookie có thể truy cập từ tất cả các đường dẫn
          .maxAge(24 * 60 * 60) // 1 ngày
          .httpOnly(true)
          .sameSite("Lax") // Cho phép cookie được gửi trong các yêu cầu điều hướng cross-site
          .build();
      logger.info("Generated JWT cookie for user: {}", userPrincipal.getUsername());
      return cookie;
    }
  
    public ResponseCookie getCleanJwtCookie() {
      ResponseCookie cookie = ResponseCookie.from(jwtCookie, null)
          .path("/") // Phải cùng path với cookie khi tạo
          .maxAge(0)
          .httpOnly(true)
          .sameSite("Lax")
          .build();
      return cookie;
    }
  
    public void cleanJwtCookie(HttpServletResponse response) {
      ResponseCookie cookie = ResponseCookie.from(jwtCookie, "")
          .path("/") // Phải cùng path với cookie khi tạo
          .maxAge(0)
          .httpOnly(true)
          .sameSite("Lax")
          .build();
      response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
      logger.info("JWT cookie cleared");
    }
  
    public String getUserNameFromJwtToken(String token) {
      return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }
  
    public boolean validateJwtToken(String authToken) {
      try {
        Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
        return true;
      } catch (SignatureException e) {
        logger.error("Invalid JWT signature: {}", e.getMessage());
      } catch (MalformedJwtException e) {
        logger.error("Invalid JWT token: {}", e.getMessage());
      } catch (ExpiredJwtException e) {
        logger.error("JWT token is expired: {}", e.getMessage());
      } catch (UnsupportedJwtException e) {
        logger.error("JWT token is unsupported: {}", e.getMessage());
      } catch (IllegalArgumentException e) {
        logger.error("JWT claims string is empty: {}", e.getMessage());
      }
  
      return false;
    }
    
    public String generateTokenFromUsername(String username) {   
      return Jwts.builder()
          .setSubject(username)
          .setIssuedAt(new Date())
          .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
          .signWith(SignatureAlgorithm.HS512, jwtSecret)
          .compact();
    }
}