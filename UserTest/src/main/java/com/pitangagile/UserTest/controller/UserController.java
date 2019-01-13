package com.pitangagile.UserTest.controller;

import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Valid;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pitangagile.UserTest.model.User;
import com.pitangagile.UserTest.model.VOUser;
import com.pitangagile.UserTest.service.UserService;
import com.pitangagile.UserTest.util.SaltedMD5;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

	@Autowired
	private UserService userService;
	private Map<String, String> errorMap;

	@PostMapping("")
	public ResponseEntity<?> saveUser(@Valid @RequestBody User user, BindingResult result) {

		if (!controleValido(user, result)) {
			return new ResponseEntity<Map<String, String>>(errorMap, HttpStatus.BAD_REQUEST);
		}
		
		User newUser = userService.saveOrUpdate(user);
		return new ResponseEntity<VOUser>(getVOUser(newUser), HttpStatus.CREATED);
	}

	@GetMapping("/signin/{user}")
	public ResponseEntity<?> login(@PathVariable String user) {
		limpaMapErro();
		JSONObject jsonObject = new JSONObject(user);
		
		String email = jsonObject.getString("email");
		if (email == null || email.isEmpty()) {
			adicionarMapErro("email", "E-mail cannot be blank.");
		}
		
		String password = jsonObject.getString("password");
		if (password == null || password.isEmpty()) {
			adicionarMapErro("password", "Password cannot be blank.");
		}
		
		if (errorMap != null && !errorMap.isEmpty()) {
			return new ResponseEntity<Map<String, String>>(errorMap, HttpStatus.BAD_REQUEST);
		}
		
		User findUser = userService.findByEmail(email);
		String hashedPassword = "";
		
		if (findUser != null) {
			hashedPassword = SaltedMD5.getSecurePassword(password, findUser.getPasswordSalt());
		}
		
		if (findUser == null || !hashedPassword.equals(findUser.getPassword())) {
			adicionarMapErro("invalidUser", "Invalid E-mail or Password.");
			return new ResponseEntity<Map<String, String>>(errorMap, HttpStatus.NOT_FOUND);
		}
	
		findUser.setLastLogin(findUser.getCurrentLogin());
		findUser.setCurrentLogin(LocalDateTime.now());
		findUser = userService.saveOrUpdate(findUser);
		
		return new ResponseEntity<VOUser>(getVOUser(findUser), HttpStatus.OK);
	}

	@GetMapping("/all")
	public Iterable<User> getAllUsers() {
		return userService.findAll();
	}

	@GetMapping("/me/{user_id}")
	public ResponseEntity<?> getUserById(@PathVariable Long user_id) {
		User user = userService.findById(user_id);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@DeleteMapping("/{user_id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long user_id) {
		User user = userService.findById(user_id);
		userService.delete(user_id);
		return new ResponseEntity<String>("Usuário " + user.getFirstName() + " excluído.", HttpStatus.OK);
	}

	/**
	 * Validação antes de salvar User. Se encontrar erros ou dados inválidos,
	 * adiciona campo e mensagem no HasMap 'erroMap'.
	 * 
	 * @param user
	 * @param result
	 * @return
	 */
	public boolean controleValido(User user, BindingResult result) {
		limpaMapErro();

		if (result.hasErrors()) {
			for (FieldError erro : result.getFieldErrors()) {
				adicionarMapErro(erro.getField(), erro.getDefaultMessage());
			}
		}

		if (user != null) {
			verificaEmail(user.getEmail());
			
			if (user.getPhones() == null || user.getPhones().isEmpty()) {
				adicionarMapErro("invalidPhones", "Must have at least 1 phone.");
			}
			
			if (user.getId() == null) {
				User findEqEmail = userService.findByEmail(user.getEmail());
				if (findEqEmail != null) {
					adicionarMapErro("email", "E-mail already registered.");
				}
			}
			try {
				byte[] salt = SaltedMD5.getSalt();
				String newPassword = SaltedMD5.getSecurePassword(user.getPassword(), salt);
				user.setPassword(newPassword);
				user.setPasswordSalt(salt);
			} catch (NoSuchProviderException | NoSuchAlgorithmException e) {
				adicionarMapErro("password", e.getMessage());
			}
		}

		return errorMap == null || errorMap.isEmpty();
	}

	private void verificaEmail(String email) {
		if (!validarEmail(email)) {
			adicionarMapErro("email", "Invalid e-mail.");
		}
	}

	private void adicionarMapErro(String chave, String mensagem) {
		if (errorMap == null) {
			errorMap = new HashMap<>();
		}
		errorMap.put(chave, mensagem);
	}

	private void limpaMapErro() {
		if (errorMap != null && !errorMap.isEmpty()) {
			errorMap.clear();
		}
	}

	public boolean validarEmail(String email) {
		String regex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(email);
		return matcher.matches();
	}
	
	public VOUser getVOUser(User user) {
		VOUser voUser = new VOUser();
		voUser.setId(user.getId());
		voUser.setFirstName(user.getFirstName());
		voUser.setLastName(user.getLastName());
		voUser.setEmail(user.getEmail());
		voUser.setDateCreation(user.getDateCreation());
		voUser.setLastLogin(user.getLastLogin());
		voUser.setPhones(user.getPhones());
		return voUser;
	}
}
