import React, { useState } from 'react';
import './SignUpForm.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        resume: null,
        profilePhoto: null,
        institutions: [
            { institution: '', startYear: '', endYear: '', mark: '' }
        ],
        skills: ['']
    });
    const [step, setStep] = useState(1);  // To handle multi-step form
    const [errors, setErrors] = useState({});

    const handleChange = (e, index = null, section = 'form') => {
        const { name, value } = e.target;
        if (section === 'institutions' && index !== null) {
            const updatedInstitutions = [...formData.institutions];
            updatedInstitutions[index][name] = value;
            setFormData({ ...formData, institutions: updatedInstitutions });
        } else if (section === 'skills' && index !== null) {
            const updatedSkills = [...formData.skills];
            updatedSkills[index] = value;
            setFormData({ ...formData, skills: updatedSkills });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        const fileSizeMB = file.size / (1024 * 1024); // Convert file size to MB

        if (name === 'resume') {
            if (file.type !== 'application/pdf') {
                setErrors({ ...errors, resume: 'Resume must be a PDF file.' });
                return;
            }
            if (fileSizeMB > 5) {
                setErrors({ ...errors, resume: 'Resume file size must be less than 5MB.' });
                return;
            }
        } else if (name === 'profilePhoto') {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setErrors({ ...errors, profilePhoto: 'Profile photo must be a JPEG or PNG file.' });
                return;
            }
            if (fileSizeMB > 2) {
                setErrors({ ...errors, profilePhoto: 'Profile photo file size must be less than 2MB.' });
                return;
            }
        }

        setErrors({ ...errors, [name]: '' });  // Clear any previous errors
        setFormData({ ...formData, [name]: file });
    };

    const handleAddInstitution = () => {
        setFormData({
            ...formData,
            institutions: [...formData.institutions, { institution: '', startYear: '', endYear: '', mark: '' }]
        });
    };

    const handleAddSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, '']
        });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log(formData);
        } else {
            alert('Please fix the errors before submitting.');
        }
    };

    const handleNextStep = () => {
        if (step === 1 && validate()) setStep(2);
        else if (step === 2) handleSubmit();
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="signup-form-container">
            <div className="signup-form-wrapper">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2 className="form-heading">Applicant Sign Up</h2>

                    {step === 1 && (
                        <>
                            <div className="form-row full-width">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <small className="error-message">{errors.name}</small>}
                            </div>

                            <div className="form-row full-width">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <small className="error-message">{errors.email}</small>}
                            </div>

                            <div className="form-row full-width">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && <small className="error-message">{errors.password}</small>}
                            </div>

                            <button type="button" className="next-btn" onClick={handleNextStep}>Next</button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {formData.institutions.map((institution, index) => (
                                <div className="form-row" key={index}>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={institution.institution}
                                        onChange={(e) => handleChange(e, index, 'institutions')}
                                        placeholder="Institution"
                                    />
                                    <input
                                        type="text"
                                        name="startYear"
                                        value={institution.startYear}
                                        onChange={(e) => handleChange(e, index, 'institutions')}
                                        placeholder="Start year"
                                    />
                                    <input
                                        type="text"
                                        name="endYear"
                                        value={institution.endYear}
                                        onChange={(e) => handleChange(e, index, 'institutions')}
                                        placeholder="End year"
                                    />
                                    <input
                                        type="text"
                                        name="mark"
                                        value={institution.mark}
                                        onChange={(e) => handleChange(e, index, 'institutions')}
                                        placeholder="Mark/Percent"
                                    />
                                </div>
                            ))}

                            <button type="button" className="add-institution-btn" onClick={handleAddInstitution}>
                                Add other institution details
                            </button>

                            {formData.skills.map((skill, index) => (
                                <div className="form-row full-width" key={index}>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={skill}
                                        onChange={(e) => handleChange(e, index, 'skills')}
                                        placeholder="Skill"
                                    />
                                </div>
                            ))}

                            <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                                Add another skill
                            </button>

                            <div className="form-row file-upload full-width">
                                <label>Resume</label>
                                <input
                                    type="file"
                                    name="resume"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                />
                                {errors.resume && <small className="error-message">{errors.resume}</small>}
                            </div>

                            <div className="form-row file-upload full-width">
                                <label>Profile photo</label>
                                <input
                                    type="file"
                                    name="profilePhoto"
                                    onChange={handleFileChange}
                                    accept=".jpeg,.jpg,.png"
                                />
                                {errors.profilePhoto && <small className="error-message">{errors.profilePhoto}</small>}
                            </div>

                            <button type="button" className="prev-btn" onClick={handlePreviousStep}>Previous</button>
                            <button type="button" className="submit-btn" onClick={handleNextStep}>Submit</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
