import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Election } from '@/utils/Types/election';
import Link from 'next/link';

interface ElectionDetailsProps {
    election: Election;
}

const ElectionDetails: React.FC<ElectionDetailsProps> = ({ election }) => {
    return (
               <Card className="max-w-sm mx-auto my-4 shadow-lg sm:max-w-md">
            <CardHeader>
                <CardTitle>Election Details</CardTitle>
                <CardDescription>{election.type}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <strong>Area:</strong> {election.area}
                    </div>
                    <div>
                        <strong>Date:</strong> {election.date}
                    </div>
                    <div>
                        <strong>Presiding Officer:</strong> {election.presiding_officer}
                    </div>
                    <div>
                        <strong>Per Area Nomineez:</strong> {election.perAreaNominees}
                    </div>
                    <div>
                        <strong>Status:</strong><Badge>{election.status}</Badge>
                    </div>
                </div>
        
                <CardDescription className="mt-4">
                    <strong>(Article 7.B)
                        <br></br> Criteria for electing members of the Advisory Council</strong>
                    <p>
                        <li>He should be a member of the Organisation but should not aspire
                            to the membership of the Advisory Council or any other post in the
                            Organisation.
                        </li>
                        <li>
                            He should be, on the whole, better than other members in his electoral
                            constituency in terms of religious knowledge, piety, understanding
                            of affairs, sagacity and soundness of opinion, observance of the
                            Constitution, and steadfastness in the way of Allah.
                        </li>
                    </p>
                </CardDescription>
                <Link href='/user/electoralCollage/vote'>
                    <Button className='mt-4'>Next</Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default ElectionDetails;