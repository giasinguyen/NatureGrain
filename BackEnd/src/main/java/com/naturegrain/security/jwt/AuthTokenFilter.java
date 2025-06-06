package com.naturegrain.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.naturegrain.security.service.UserDetailsServiceImpl;



public class AuthTokenFilter extends OncePerRequestFilter  {

    @Autowired
    private JwtUtils jwtUtils;
  
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
  
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);
  
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
      try {
        String jwt = parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
          String username = jwtUtils.getUserNameFromJwtToken(jwt);
  
          try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails,
                                                        null,
                                                        userDetails.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    
            SecurityContextHolder.getContext().setAuthentication(authentication);
          } catch (UsernameNotFoundException e) {
            // User not found but JWT is valid - this can happen if user was deleted
            // Just log it and don't set authentication - user will be treated as anonymous
            logger.warn("JWT valid but user {} no longer exists in the database", username);
            // Clear any invalid cookies
            jwtUtils.cleanJwtCookie(response);
          }
        }
      } catch (Exception e) {
        logger.error("Cannot set user authentication: {}", e);
      }
  
      filterChain.doFilter(request, response);
    }
  
    private String parseJwt(HttpServletRequest request) {
      String jwt = jwtUtils.getJwtFromCookies(request);
      return jwt;
    }
}