import { Head } from "@inertiajs/react";
import PageContent from "@/Components/ui/admin/PageContent";

export default function HomePage() {
    const breadcrumbItems = [{ label: "Home" }];

    return (
        <>
            <Head title="Admin" />
            <PageContent
                breadcrumbItems={breadcrumbItems}
                pageTitle="Home Page"
                pageClassName="mt-4"
            >
                asdaslorem100 Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Dolor, quo debitis. At pariatur, eius
                consectetur cumque assumenda dicta. Nemo necessitatibus rerum
                natus aperiam est deleniti at. Amet dolores laudantium eum
                fugiat vero cum sit praesentium rerum, alias, temporibus
                voluptate suscipit deserunt exercitationem quas aspernatur
                aliquam nobis ipsum provident natus asperiores! Dolores illo
                culpa cum modi doloremque consectetur quam, sequi aperiam eum
                adipisci earum vitae numquam quis quod possimus a asperiores
                consequatur officia maxime ab. Eos commodi beatae nesciunt earum
                maiores harum possimus cum excepturi eligendi mollitia aliquid
                nam quis maxime fugit, perspiciatis ipsam tempore vitae! Sit
                nemo enim alias hic?
            </PageContent>
        </>
    );
}
