import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Election } from '@/utils/Types/election';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ElectionDetailsProps {
    election: Election;
}

const ElectionDetails: React.FC<ElectionDetailsProps> = ({ election }) => {
    return (
        <Card className="max-w-md mx-auto my-4 shadow-lg">
            <CardHeader>
                <CardTitle>{election.area} Elections</CardTitle>
                <CardDescription>{election.type} Election</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <strong>Nominee Size:</strong> {election.nominee_size}
                    </div>
                    <div>
                        <strong>Status:</strong><Badge>{election.status}</Badge>
                    </div>

                </div>

                <CardDescription className="mt-2">
                    <strong>(Article 7.A)

                        <br className='mt-1'></br> Criterea for Office-bearers of the Organisation:</strong>
                    <p>
                    

<li>He should be a member of the Organisation but should not aspire
to any post.
</li>
<li>
He should be, on the whole, better than other members in his electoral
or appointment constituency in terms of religious knowledge, piety,
understanding of affairs, sagacity and soundness of opinion, observance
of the Constitution, struggle and steadfastness in the way of Allah, and
organisational abilities.
</li>  </p>              </CardDescription>
<Link href='/user/presidential/vote'>
        <Button className='mt-4'>Next</Button>
        </Link>
            </CardContent>
        </Card>
    );
};

export default ElectionDetails;