//app/dashboard/page.jsx
import PageContainer from '@/components/layout/PageContainer';
import {
    ThemedCard,
    ThemedCardHeader,
    ThemedCardTitle,
    ThemedCardContent,
    ThemedCardDescription,
} from '@/components/ui/ThemedCard';

export default function DashboardPage() {
    return (
        <PageContainer>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
            </div>

            <ThemedCard>
                <ThemedCardHeader>
                    <ThemedCardTitle>Overview</ThemedCardTitle>
                    <ThemedCardDescription>
                        Quick stats and shortcuts
                    </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                    <div className="text-secondary-700 dark:text-gray-300">
                        Coming soon: your dashboard widgets.
                    </div>
                </ThemedCardContent>
            </ThemedCard>
        </PageContainer>
    );
}
