import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import ChatLayout from "../Layouts/ChatLayout";

function Home({auth}) {
    return <>Messages</>
}

// That way to provide Persistent layouts in Inertia
Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    )
}

export default Home;