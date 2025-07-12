import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Shared/Loading';

const PendingClasses = () => {
    const axiosSecure = useAxiosSecure();

    const { data: pendingClasses = [], isLoading, refetch } = useQuery({
        queryKey: ['pending-classes'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/pending-classes');
            return res.data;
        }
    });

    const approveMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/admin/approve-class/${id}`);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount > 0) {
                Swal.fire('Success', 'Class approved!', 'success');
                refetch();
            }
        },
        onError: () => {
            Swal.fire('Error', 'Failed to approve class.', 'error');
        }
    });

    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve this class?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, approve',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate(id);
            }
        });
    };

    if (isLoading) return <Loading></Loading>

        return (
            <div className="max-w-6xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Pending Classes</h2>
                {pendingClasses.length === 0 ? (
                    <p className="text-center">No pending classes.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingClasses.map((cls) => (
                            <div key={cls._id} className="border rounded-lg shadow p-4 bg-white">
                                <img src={cls.image} alt={cls.name} className="w-full h-40 object-cover rounded mb-3" />
                                <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                                <p><strong>Price:</strong> ${cls.price}</p>
                                <p><strong>Seats:</strong> {cls.seats}</p>
                                <p><strong>Teacher:</strong> {cls.teacherName}</p>
                                <p><strong>Email:</strong> {cls.teacherEmail}</p>
                                <p className="capitalize"><strong>Status:</strong> {cls.status}</p>
                                <button
                                    onClick={() => handleApprove(cls._id)}
                                    className="btn btn-sm bg-green-500 text-white hover:bg-green-600 mt-3"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
};

export default PendingClasses;
