import { useRouter } from 'next/router';
import { structure } from '../../helpers/structure';

export default function ComponentPageItem () {
    const router = useRouter();
    const pageId = router.query.id;
    const pageData = structure.find(item => item.id === pageId);
    if (!pageData || !pageData.component) return null;
    const Component = pageData.component;

    return (
            <Component />
    );
}

export async function getStaticProps(context: any) {
    console.log('getStaticProps in Tables')
    return {
        props: {}, // will be passed to the page component as props
    }
}

export async function getStaticPaths() {
    console.log('getStaticPaths')
    return {
        paths: [
            { params: { } } // See the "paths" section below
        ],
        // fallback: true, false, or 'blocking' // See the "fallback" section below
    };
}