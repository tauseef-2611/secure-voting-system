import * as React from 'react';
import { Election } from '@/utils/Types/election';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ElectionDetailsProps {
    election: Election;
}

const ElectionDetails: React.FC<ElectionDetailsProps> = ({ election }) => {
    const [status, setStatus] = React.useState(election.status);
    const [isSelectOpen, setIsSelectOpen] = React.useState(false);
    const router = useRouter();

    const handleStatusChange = async (value: string) => {
        setStatus(value);
        try {
            await axios.post('/api/admin/update-status', { status: value })
                .then((res) => {
                    console.log(res);
                });
            alert("Status updated successfully");
        } catch (err) {
            alert("Something went wrong");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.post('/api/admin/delete-election')
                .then((res) => {
                    console.log(res);
                });
            alert("Election deleted successfully");
            router.push('/dashboard');
        } catch (err) {
            alert("Something went wrong");
        }
    };

    return (
<div className="dashboard-container p-4 max-w-2xl mx-auto my-4 shadow-lg rounded-lg">
    <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-xl font-bold">Election Details</h2>
            <p className="text-gray-600">{election.type}</p>
        </div>
        <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
            <Button variant="default" onClick={() => setIsSelectOpen(!isSelectOpen)}>Update</Button>
        </div>
    </div>
    <div className="space-y-2 mb-4">
        <div>
            <strong>Type:</strong> {election.type}
        </div>
        <div>
            <strong>Area:</strong> {election.area}
        </div>
        <div>
            <strong>Date:</strong> {election.date}
        </div>
        <div>
            <strong>Presiding Officer:</strong> {election.presiding_officer}
        </div>
    </div>
    <div className="mb-4">
        <strong>Status:</strong>
        <button onClick={() => setIsSelectOpen(!isSelectOpen)} className="ml-2">
            <Badge>{status}</Badge>
        </button>
        {isSelectOpen && (
            <Select onValueChange={handleStatusChange} defaultValue={status}>
                <SelectTrigger>
                    <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ongoing">Start</SelectItem>
                    <SelectItem value="completed">Stop</SelectItem>
                </SelectContent>
            </Select>
        )}
    </div>

    <div className="text-gray-600">
        For any help contact +91 7095263370
    </div>
</div>
    );
};

export default ElectionDetails;