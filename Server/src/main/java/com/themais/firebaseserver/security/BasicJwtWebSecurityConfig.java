package com.themais.firebaseserver.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.themais.firebaseserver.security.jwtauthentication.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAKey;
import java.util.Arrays;

/**
 * Created by nguyenqmai on 7/11/2017.
 */

public abstract class BasicJwtWebSecurityConfig extends WebSecurityConfigurerAdapter {
    private static final Logger logger = LoggerFactory.getLogger(BasicJwtWebSecurityConfig.class);
    @Value("${app.security.NOT_PROTECTED_URL_PATTERNS}")
    private String[] NOT_PROTECTED_URL_PATTERNS;

    @Value("${app.security.PROTECTED_URL_PATTERNS}")
    private String PROTECTED_URL_PATTERNS;


    @Value("${app.cors.allowedPattern}")
    private String corsAllowedPattern;

    @Value("${app.cors.allowedOrigins}")
    private String[] corsAllowedOrigins;
    @Value("${app.cors.allowedMethods}")
    private String[] corsAllowedMethods;
    @Value("${app.cors.allowedHeaders}")
    private String[] corsAllowedHeaders;

    @Value("${app.jwt.TOKEN_PUBLIC_KEY_FILE}")
    private String JWT_TOKEN_PUBLIC_KEY_FILE;

    @Value("${app.jwt.TOKEN_HEADER_PARAM}")
    private String JWT_TOKEN_HEADER_PARAM;
    @Value("${app.jwt.TOKEN_HEADER_PREFIX}")
    private String JWT_TOKEN_HEADER_PREFIX;
    @Value("${app.jwt.TOKEN_ISSUER}")
    private String JWT_TOKEN_ISSUER;

    @Value("${app.jwt.AUDIENCES}")
    private String[] JWT_TOKEN_AUDIENCES;
    @Value("${app.jwt.CLAIM_URIS")
    private String[] JWT_TOKEN_CLAIM_URIS;
    @Value("${app.jwt.TOKEN_PRINCIPAL_NAME_FIELD}")
    private String JWT_TOKEN_PRINCIPAL_NAME_FIELD;
    @Value("${app.jwt.TOKEN_LEEWAY_SECONDS}")
    private long TOKEN_LEEWAY_SECONDS;

    @Autowired
    private RestAuthenticationEntryPoint authenticationEntryPoint;
    @Autowired
    private AuthenticationSuccessHandler successHandler;
    @Autowired
    private AuthenticationFailureHandler failureHandler;
    @Autowired
    private JwtAuthenticationProvider jwtAuthenticationProvider;
    @Autowired
    private AuthenticationManager authenticationManager;

    private ObjectMapper objectMapper = new ObjectMapper();


    protected JwtTokenAuthenticationProcessingFilter buildJwtTokenAuthenticationProcessingFilter() throws Exception {

        logger.info("Token header param {}", JWT_TOKEN_HEADER_PARAM);
        logger.info("Token header prefix {}", JWT_TOKEN_HEADER_PREFIX);
        logger.info("Token public key file {}", JWT_TOKEN_PUBLIC_KEY_FILE);
        logger.info("Token issuer {}", JWT_TOKEN_ISSUER);
        logger.info("Token leeway (in seconds) {}", TOKEN_LEEWAY_SECONDS);

        JwtTokenAuthenticationProcessingFilter filter =
                new JwtTokenAuthenticationProcessingFilter(
                        new SkipPathRequestMatcher(Arrays.asList(NOT_PROTECTED_URL_PATTERNS), PROTECTED_URL_PATTERNS),
                        JWT_TOKEN_HEADER_PARAM,
                        tokenExtractor(JWT_TOKEN_HEADER_PREFIX),
                        jwtVerifier(getX509PublicKey(JWT_TOKEN_PUBLIC_KEY_FILE), JWT_TOKEN_ISSUER, TOKEN_LEEWAY_SECONDS),
                        failureHandler);
        filter.setAuthenticationManager(this.authenticationManager);
        return filter;
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new MyAuthenticationSuccessHandler();
    }

    @Bean
    public AuthenticationFailureHandler failureHandler() {
        return new MyAuthenticationFailureHandler(objectMapper);
    }

    @Bean
    public RestAuthenticationEntryPoint restAuthenticationEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider() {
        logger.info("Token principal name field {}", String.join(",", JWT_TOKEN_PRINCIPAL_NAME_FIELD));
        logger.info("Token claim URIs {}", String.join(",", JWT_TOKEN_CLAIM_URIS));
        return new JwtAuthenticationProvider(JWT_TOKEN_PRINCIPAL_NAME_FIELD, Arrays.asList(JWT_TOKEN_CLAIM_URIS));
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                logger.info("corsConfigurer.addCorsMappings allowedOrigins => {}", corsAllowedOrigins.toString());
                logger.info("corsConfigurer.addCorsMappings allowedMethods => {}", corsAllowedMethods.toString());
                logger.info("corsConfigurer.addCorsMappings allowedHeaders => {}", corsAllowedHeaders.toString());

                registry.addMapping(corsAllowedPattern)
                        .allowCredentials(true)
                        .allowedHeaders(corsAllowedHeaders)
                        .allowedMethods(corsAllowedMethods)
                        .allowedOrigins(corsAllowedOrigins);
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.info("corsConfigurationSource allowedOrigins => {}", corsAllowedOrigins.toString());
        logger.info("corsConfigurationSource allowedMethods => {}", corsAllowedMethods.toString());
        logger.info("corsConfigurationSource allowedHeaders => {}", corsAllowedHeaders.toString());

        final CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(corsAllowedOrigins));
        configuration.setAllowedMethods(Arrays.asList(corsAllowedMethods));
        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.setAllowCredentials(true);
        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.setAllowedHeaders(Arrays.asList(corsAllowedHeaders));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
        DefaultHttpFirewall firewall = new DefaultHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        return firewall;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(jwtAuthenticationProvider);
    }

    @Override
    public void configure(WebSecurity webSecurity) throws Exception {
        logger.info("Protected URL pattern {}", PROTECTED_URL_PATTERNS);
        webSecurity.
                httpFirewall(allowUrlEncodedSlashHttpFirewall()).
                ignoring().antMatchers(NOT_PROTECTED_URL_PATTERNS);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        logger.info("Un-protected URL patterns {}", String.join(";", NOT_PROTECTED_URL_PATTERNS));

        http
                .cors().and()
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(this.authenticationEntryPoint)

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                .authorizeRequests()
                .antMatchers(PROTECTED_URL_PATTERNS).authenticated() // Protected API End-points

                .and()
                .addFilterBefore(buildJwtTokenAuthenticationProcessingFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    JWTVerifier jwtVerifier(RSAKey signingPublicKey, String issuer, long tokenLeewaySeconds) {
        logger.info("Token audiences {}", String.join(";", JWT_TOKEN_AUDIENCES));
        return JWT.
                require(Algorithm.RSA256(signingPublicKey)).
                withIssuer(issuer).
                withAudience(JWT_TOKEN_AUDIENCES).
                acceptLeeway(tokenLeewaySeconds).
                build();
    }

    static TokenExtractor tokenExtractor(String headerPrefix) {
        return new JwtHeaderTokenExtractor(headerPrefix);
    }

    static RSAKey getX509PublicKey(String resourceName) throws Exception {
        Path filePath = Paths.get(resourceName);
        if (filePath.toFile().isFile() && filePath.toFile().canRead()) {
            try (InputStream is = (new FileInputStream(filePath.toFile()))) {
                return getX509PublicKey(is);
            }

        } else {
            try (InputStream is = (new ClassPathResource(resourceName).getInputStream())) {
                return getX509PublicKey(is);
            }
        }
    }

    static RSAKey getX509PublicKey(InputStream is) throws Exception {
        try {
            CertificateFactory fact = CertificateFactory.getInstance("X.509");
            X509Certificate cer = (X509Certificate) fact.generateCertificate(is);
            return (RSAKey) cer.getPublicKey();
        } catch (CertificateException e) {
            throw e;
        }
    }


}
