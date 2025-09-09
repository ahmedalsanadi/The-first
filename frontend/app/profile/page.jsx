import PageContainer from '@/components/layout/PageContainer';
import {
    ThemedCard,
    ThemedCardHeader,
    ThemedCardTitle,
    ThemedCardContent,
    ThemedCardDescription,
} from '@/components/ui/ThemedCard';

export default function ProfilePage() {
    return (
        <PageContainer>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Profile
                </h1>
            </div>

            <ThemedCard>
                <ThemedCardHeader>
                    <ThemedCardTitle>Your Profile</ThemedCardTitle>
                    <ThemedCardDescription>
                        Account overview and settings
                    </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                    <div className="text-secondary-700 dark:text-gray-300">
                        Coming soon: profile details.
                    </div>
                </ThemedCardContent>
            </ThemedCard>
        </PageContainer>
    );
}
