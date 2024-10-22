import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DriverOnboard() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [idType, setIdType] = useState('');
    const [idFile, setIdFile] = useState(null);
    const [driverImage, setDriverImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setIdFile(file);
    };

    const handleDriverImageChange = (event) => {
        const file = event.target.files[0];
        setDriverImage(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (!name || age < 18 || !idType || !idFile || !driverImage) {
            toast.error('Please fill in all fields correctly.');
            return;
        }

        let allPassed = true;
        let requiresManualReview = false;

        
        try {
            const formData = new FormData();
            const fileType = idFile.name.split('.').pop().toLowerCase();
            formData.append(fileType === 'pdf' ? 'pdf' : 'image', idFile);
            formData.append('countryId', 'ind');
            formData.append('documentId', idType === 'aadhar' ? 'id' : idType === 'pan card' ? 'pan' : 'passport');

            const response = await axios.post('https://ind.idv.hyperverge.co/v1/readId', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    appId: 'z4vs0n',
                    appkey: 'inriytyp7vys6juzn9qq',
                    transactionId: 'kubsDriverOnboarding',
                },
            });
            const idVerificationResult = response.data.result.summary.action;

            if (idVerificationResult === 'pass') {
                toast.success('ID verification successful!');
            } else if (idVerificationResult === 'manualReview') {
                toast.warn('ID verification requires manual review.');
                requiresManualReview = true;
            } else {
                toast.error('ID verification failed.');
                allPassed = false;
            }
        } catch (error) {
            toast.error('An error occurred during the ID verification process.');
            allPassed = false;
        }

        // Liveness Check API call
        try {
            const livenessData = new FormData();
            const imageType = driverImage.name.split('.').pop().toLowerCase();
            livenessData.append(imageType === 'pdf' ? 'pdf' : 'image', driverImage);

            const livenessResponse = await axios.post('https://ind.idv.hyperverge.co/v1/checkLiveness', livenessData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    appId: 'z4vs0n',
                    appkey: 'inriytyp7vys6juzn9qq',
                    transactionId: 'kubsDriverOnboarding',
                },
            });
            const livenessResult = livenessResponse.data.result.summary.action;

            if (livenessResult === 'pass') {
                toast.success('Liveness check successful!');
            } else if (livenessResult === 'manualReview') {
                toast.warn('Liveness check requires manual review.');
                requiresManualReview = true;
            } else {
                toast.error('Liveness check failed.');
                allPassed = false;
            }
        } catch (error) {
            toast.error('An error occurred during the liveness check process.');
            allPassed = false;
        }

        // Face Matching API call
        try {
            const matchFaceData = new FormData();
            matchFaceData.append('selfie', driverImage);
            matchFaceData.append('id', idFile);

            const matchFaceResponse = await axios.post('https://ind.idv.hyperverge.co/v1/matchFace', matchFaceData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    appId: 'z4vs0n',
                    appkey: 'inriytyp7vys6juzn9qq',
                    transactionId: 'kubsDriverOnboarding',
                },
            });
            const matchFaceResult = matchFaceResponse.data.result.summary.action;

            if (matchFaceResult === 'pass') {
                toast.success('Face matching successful!');
            } else if (matchFaceResult === 'manualReview') {
                toast.warn('Face matching requires manual review.');
                requiresManualReview = true;
            } else {
                toast.error('Face matching failed.');
                allPassed = false;
            }
        } catch (error) {
            toast.error('An error occurred during the face matching process.');
            allPassed = false;
        }

        // Final result based on all checks
        if (allPassed && !requiresManualReview) {
            toast.success('All checks passed successfully!');
        } else if (requiresManualReview) {
            toast.warn('Some checks require manual review. Please await further instructions.');
        } else {
            toast.error('Verification failed. Please re-upload the files.');
        }
    };

    return (
        <div className="form-container">
            <h2>Driver Onboarding</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter driver's name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Age:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter driver's age"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>ID Type:</label>
                    <select value={idType} onChange={(e) => setIdType(e.target.value)} required>
                        <option value="">Select an ID type</option>
                        <option value="aadhar">Aadhar</option>
                        <option value="pan card">PAN Card</option>
                        <option value="passport">Passport</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Upload ID Proof:</label>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Driver Image:</label>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleDriverImageChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}
