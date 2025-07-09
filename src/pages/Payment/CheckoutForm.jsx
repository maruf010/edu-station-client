import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CheckoutForm = ({ classData, closeModal, refetch }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        try {
            // Step 1: Get client secret
            const { data } = await axiosSecure.post('/create-payment-intent', {
                price: classData.price
            });

            const clientSecret = data.clientSecret;

            // Step 2: Create payment method
            const { paymentMethod, error: methodError } = await stripe.createPaymentMethod({
                type: 'card',
                card,
                billing_details: {
                    name: user.displayName,
                    email: user.email
                }
            });

            if (methodError) {
                setError(methodError.message);
                return;
            }

            setProcessing(true);

            // Step 3: Confirm payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id
            });

            if (confirmError) {
                setError(confirmError.message);
                return;
            }

            // Step 4: If payment successful
            if (paymentIntent.status === 'succeeded') {
                // Save payment data
                const paymentData = {
                    userEmail: user.email,
                    classId: classData._id,
                    className: classData.name,
                    classImage: classData.image,
                    teacherName: classData.teacherName,
                    teacherEmail: classData.teacherEmail,
                    price: classData.price,
                    date: new Date(),
                    transactionId: paymentIntent.id,
                    status: 'paid'
                };

                await axiosSecure.post('/payments', paymentData);

                // Save enrollment data separately
                const enrollmentData = {
                    ...paymentData,
                    status: 'enrolled'
                };

                const res = await axiosSecure.post('/enrollments', enrollmentData);

                if (res.data.insertedId) {
                    toast.success('Enrollment successful!');
                    await refetch();
                    closeModal();
                }
            } else {
                setError('Payment failed. Please try again.');
            }

        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <CardElement className="border p-4 rounded" />
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!stripe || !elements || processing}
            >
                {processing ? 'Processing...' : `Pay $${classData.price}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
