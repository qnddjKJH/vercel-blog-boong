import Head from "next/head";
import Date from "../../components/Date";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from '../../styles/utils.module.css';
import { useRouter } from 'next/router';

export async function getStaticPaths() {
    const paths = await getAllPostIds();
    return {
        paths,
        // fallback: false,    
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}

export default function Post({ postData }) {
    const router = useRouter();
    const query = router.query;

    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}