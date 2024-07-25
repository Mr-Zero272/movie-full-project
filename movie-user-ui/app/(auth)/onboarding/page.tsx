import AccountProfile from '@/components/forms/AccountProfile';
import { currentUser } from '@clerk/nextjs/server';
import { type User } from '@/types/user';

async function Page() {
    const user = await currentUser();

    const userInfo = {
        _id: '',
        username: '',
        name: '',
        bio: '',
        image: '',
    };
    const userData: User = {
        id: user?.id || '',
        objectId: userInfo?._id || '',
        username: userInfo?.username || user?.username || '',
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl || '',
    };
    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">On boarding</h1>
            <p className="text-base-regular text-light-2 mt-3">Complete your profile now to use Threads</p>
            <section className="bg-dark-2 mt-9 p-10">
                <AccountProfile user={userData} btnTitle="Continue" />
            </section>
        </main>
    );
}

export default Page;
