import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Youtube, Instagram, Twitter, Globe, Link as LinkIcon, MapPin, CalendarDays } from "lucide-react";

interface CreatorHeroProps {
    user: any; // Type strictly if possible
}

export function CreatorHero({ user }: CreatorHeroProps) {
    const socialLinks = user.socialLinks; // Parsed JSON
    const bgStyle = user.creatorProfile?.coverImage
        ? { backgroundImage: `url(${user.creatorProfile.coverImage})` }
        : { backgroundColor: user.creatorProfile?.accentColor || '#3b82f6' };

    return (
        <div className="relative mb-20">
            {/* Cover Image/Color */}
            <div className="h-48 md:h-80 w-full bg-cover bg-center rounded-b-3xl relative overflow-hidden group" style={bgStyle}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            <div className="container px-4 absolute -bottom-16 left-0 right-0 flex flex-col md:flex-row items-end md:items-end gap-6">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl rounded-2xl">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} className="object-cover" />
                    <AvatarFallback className="text-4xl font-bold bg-muted">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="mb-2 flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        {user.role === 'CREATOR' && (
                            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">Verified Creator</Badge>
                        )}
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">@{user.username}</p>

                    {user.creatorProfile?.headline && (
                        <p className="text-foreground/80 mt-1 max-w-2xl">{user.creatorProfile.headline}</p>
                    )}
                </div>

                {/* Social Links */}
                <div className="flex gap-2 mb-4 md:mb-6">
                    {socialLinks?.facebook && (
                        <SocialButton href={socialLinks.facebook} icon={<Facebook className="h-4 w-4" />} />
                    )}
                    {socialLinks?.youtube && (
                        <SocialButton href={socialLinks.youtube} icon={<Youtube className="h-4 w-4" />} />
                    )}
                    {socialLinks?.instagram && (
                        <SocialButton href={socialLinks.instagram} icon={<Instagram className="h-4 w-4" />} />
                    )}
                    {socialLinks?.twitter && (
                        <SocialButton href={socialLinks.twitter} icon={<Twitter className="h-4 w-4" />} />
                    )}
                    {socialLinks?.website && (
                        <SocialButton href={socialLinks.website} icon={<Globe className="h-4 w-4" />} />
                    )}
                </div>
            </div>

        </div>
    );
}

export function CreatorBio({ bio }: { bio: string | null }) {
    if (!bio) return null;
    return (
        <div className="bg-muted/30 p-4 rounded-xl border border-border/50 max-w-3xl mb-8">
            <p className="text-sm leading-relaxed whitespace-pre-line">{bio}</p>
        </div>
    );
}

function SocialButton({ href, icon }: { href: string; icon: React.ReactNode }) {
    if (!href) return null;
    return (
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-background/80 hover:bg-background border-border/50 hover:text-primary transition-colors" asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
                {icon}
            </a>
        </Button>
    );
}
