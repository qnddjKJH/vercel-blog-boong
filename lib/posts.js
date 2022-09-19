import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// 정렬된 포스트 데이터를 들고온다.
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory); // posts 디렉토리 안 파일 이름들을 다 읽어온다.
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');   // .md 확장자 삭제 후 파일이름 id 로 저장

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);   // 전체 경로
    const fileContents = fs.readFileSync(fullPath, 'utf8'); // 경로를 utf-8 로 내용 읽어 들임

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);  // md 파일 상단 gray-matter 로 metadata 를 읽어들임

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  // 정렬 로직
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getAllPostIds() {
    const fileName = fs.readdirSync(postsDirectory);

    return fileName.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);


    // 마크다운 content -> html 해석
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data,
    }
}

export async function createPost({id, title, date, content}) {
  const fullPath = path.join(postsDirectory, `${id}.md`)

  const data = `---
title : '${title}'
date : '${date}'
---

${content}`

  fs.writeFileSync(fullPath, data)
}