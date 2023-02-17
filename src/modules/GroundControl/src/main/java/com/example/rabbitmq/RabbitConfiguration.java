package com.example.rabbitmq;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@EnableRabbit
@Configuration
public class RabbitConfiguration {

//    private static final String GROUND_CONTROL = "Ground Control";
//    // private static final String GLOBAL_QUEUE="globalExchange";

    @Value("${spring.rabbitmq.host}")
    private String host;
    @Value("${spring.rabbitmq.virtualhost}")
    private String virtualHost;
    @Value("${spring.rabbitmq.username}")
    private String username;
    @Value("${spring.rabbitmq.password}")
    private String password;
    @Value("${rabbitmq.queue}")
    private String queue;
    @Value("${rabbitmq.exchangeGC}")
    private String exchangeGC;
    @Value("${rabbitmq.exchangeGL}")
    private String exchangeGL;

    @Bean
    public ConnectionFactory connectionFactory() {

        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setVirtualHost(virtualHost);
        connectionFactory.setHost(host);
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        log.info("Connection create");
        return connectionFactory;
    }

    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory() {
        final SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory());
        factory.setMessageConverter(jsonMessageConverter());
        return factory;
    }

    @Bean
    public Queue myQueue() {
        return new Queue(queue, false);
    }

    //    @Bean
//    public Queue myQueueGlobal() {
//        return new Queue(GLOBAL_QUEUE,false);
//    }
    @Bean
    public FanoutExchange fanoutExchangeGC() {
        return new FanoutExchange(exchangeGC);
    }

    @Bean
    public FanoutExchange fanoutExchangeGlobal() {
        return new FanoutExchange(exchangeGL);
    }

    @Bean
    public Binding binding1() {
        return BindingBuilder.bind(myQueue()).to(fanoutExchangeGC());
    }

    @Bean
    public Binding bindingTemp() {
        return BindingBuilder.bind(myQueue()).to(fanoutExchangeGlobal());
    }


}