package com.pitangagile.UserTest.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.pitangagile.UserTest.model.User;

@Repository
public interface UserRepository extends CrudRepository<User, Long>{

	User getById(Long id);
	
	User findByEmailAndPassword(String email, String password);
	
	User findByEmail(String email);
}
