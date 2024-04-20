import axios from 'axios';
import React, { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

      const completeRegister = async (event) => {
        event.preventDefault();

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (formData.email && !emailRegex.test(formData.email)) {
            alert('Invalid email format.');
            return;
        }
        else if (!formData.username || !formData.email || !formData.password) {
            alert('Please fill in all required fields.');
            return;
        }
        else if (formData.password !== formData.passwordConfirm) {
            alert('Passwords do not match.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/register', formData); // change to 8000 !!!!!!!!!!!! ***
            alert('Registration successful!');
          
        } catch (error) {
            console.error('Error creating new account', error);
            alert('Error creating new account. Please try again.');
        }
    };

    return (
        <div style={{ paddingLeft: '20%' }}>
            <form id="registerform" className="form-group">
                <div>
                    <div className="form-group-reg">
                        <label className="welc-label"> Username*</label>
                        <br />
                        <input className="welc-input" type='text' id='username' value={formData.username} onChange={handleInputChange} required></input>
                    </div>
                    <div className="form-group-reg">
                        <p style={{ display: 'block', textAlign: 'left', color: '#3d3d3d', padding: 0, margin: 0 }}><i>  Provide email in form ********@****.**</i></p>
                        <div style={{ display: 'block', width: '100%' }}>
                            <label className="welc-label"> Email*</label>
                            <br />
                            <input className="welc-input" type='email' id='email' value={formData.email} onChange={handleInputChange} required></input>
                        </div>
                    </div>
                    <div className="form-group-reg">
                        <p style={{ display: 'block', textAlign: 'left', color: '#3d3d3d', padding: 0, margin: 0 }}><i>Password may not contain your username or email</i></p>
                        <label className="welc-label"> Password*</label>
                        <br />
                        <input className="welc-input" type='password' id='password' value={formData.password} onChange={handleInputChange} required></input>
                    </div>
                    <div className="form-group-reg">
                        <label className="welc-label"> Confirm password*</label>
                        <br />
                        <input className="welc-input" type='password' id='passwordConfirm' value={formData.passwordConfirm} onChange={handleInputChange} required></input>
                    </div>
                </div>
                <div style={{ paddingLeft: '38%' }}>
                    <div className="form-group-reg" style={{ textAlign: 'center', position: 'relative', paddingLeft: 0, width: '100%', paddingTop: '0px' }}>
                        <button className="welc-the-button" onClick={completeRegister} type="submit">Register</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm;
