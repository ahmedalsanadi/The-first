import Image from 'next/image';
import PageContainer from '@/components/layout/PageContainer';
import {
    ThemedCard,
    ThemedCardContent,
    ThemedCardHeader,
    ThemedCardTitle,
    ThemedCardDescription,
} from '@/components/ui/ThemedCard';
import ToggleTheme from '@/components/ui/ThemeToggle';
import DirectionToggle from '@/components/ui/DirectionToggle';

export default function Home() {
    return (
        <PageContainer>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Home
                </h1>
                <div className="flex items-center gap-2">
                    <DirectionToggle />
                    <ToggleTheme />
                </div>
            </div>

            <ThemedCard>
                <ThemedCardHeader>
                    <ThemedCardTitle>Welcome</ThemedCardTitle>
                    <ThemedCardDescription>
                        This UI adapts to light/dark themes and RTL/LTR
                        directions.
                    </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                    Use the theme toggle to switch modes. Direction is
                    controlled globally via the app store.
                </ThemedCardContent>
            </ThemedCard>
        </PageContainer>
    );
}
