package com.pitangagile.UserTest.service;

import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pitangagile.UserTest.model.User;
import com.pitangagile.UserTest.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public User saveOrUpdate(User user) {
		java.sql.Date dtAtual = new java.sql.Date(Calendar.getInstance().getTime().getTime());
		if (user.getId() == null) {
			user.setDateCreation(dtAtual);
		}
		return userRepository.save(user);
	}

	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	public User findById(Long id) {
		return userRepository.getById(id);
	}

	public User signIn(String email, String password) {
		return userRepository.findByEmailAndPassword(email, password);
	}

	public User findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public void delete(Long id) {
		User user = findById(id);
		userRepository.delete(user);
	}
}
