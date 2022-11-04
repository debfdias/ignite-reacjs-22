import { useState } from 'react';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Post } from './components/Post';

import './styles/global.css';
import styles from './styles/app.module.css';

const posts = [
  {
    id:1,
    author: {
      avatarUrl: "https://github.com/debfdias.png",
      name: "Debs FD",
      role: "Fullstack Dev"
    },
    content: [
      {type: 'paragraph', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
      {type: 'paragraph', content:'Maioreees repellat nesciunt ullam deleniti corporis debitis, doloribus provident quaerat.'},
      {type: 'link', content:'Lorem ipsum dolor sit amet consectetur adipisicing elit.'},
    ],
    publishedAt: new Date('2022-05-03 10:30:00')
  },
  {
    id:1,
    author: {
      avatarUrl: "https://github.com/diego3g.png",
      name: "Diegão Schell",
      role: "CEO Rocket"
    },
    content: [
      {type: 'paragraph', content: 'Yorem ipsum dolor sit amet consectetur adipisicing elit.'},
      {type: 'paragraph', content:'Maiores repellat nesciunt ullam deleniti corporis debitis, doloribus provident quaerat.'},
      {type: 'link', content:'Erorem ipsum dolor sit amet consectetur adipisicing elit.'},
    ],
    publishedAt: new Date('2022-10-22 20:00:00')
  },
];

const comments = [

]

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          {posts.map(post => {
            return (
              <Post 
                key={post.id}
                author={post.author}
                content={post.content}
                publishedAt={post.publishedAt}
              />
            )
          })}
        </main>
      </div>
    </div>
  )
}

export default App
