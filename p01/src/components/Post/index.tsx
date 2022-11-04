import { format, formatDistanceToNow } from 'date-fns';

import { Comment } from '../Comment';
import { Avatar } from '../Avatar';
import styles from './styles.module.css';
import { useState, FormEvent, ChangeEvent } from 'react';

interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: string;
  content: string;
}

interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState(['Very nice!']);
  const [newCommentText, setNewCommentText] = useState('');

  /*
  const dateFormatted0 = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(publishedAt);
  */

  const dateFormatted = format(publishedAt, "LLLL d 'at' HH:mm");

  const dateRelative = formatDistanceToNow(publishedAt, {
    addSuffix: true
  });

  function handleSubmitComment(event: FormEvent){
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText('');
  }

  function handleNewCommentText(event: ChangeEvent<HTMLTextAreaElement>){
    setNewCommentText(event.target.value);
  }

  function deleteComment(commentToBeDeleted: string) {
    const newCommentsList = comments.filter(comment => {
      return comment != commentToBeDeleted;
    });

    setComments(newCommentsList);
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar hasBorder src={author.avatarUrl}/>
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={dateFormatted} dateTime="2022-05-15">
          {dateRelative}
        </time>
      </header>

      <div className={styles.content}>
        {content.map(line => {
          if(line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === 'link') {
            return <p key={line.content}><a href="#">{line.content}</a></p>
          }
        })}  
      </div>

      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <strong className={styles.feedback}>Leave a comment!</strong>

        <textarea 
          name="comment" 
          placeholder='Leave a comment!'
          onChange={handleNewCommentText}
          value={newCommentText}
          required
        >
        </textarea>

        <footer>
          <button disabled={newCommentText.length === 0} type='submit'>Publish</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment 
              key={comment} 
              content={comment} 
              onDeleteComment={deleteComment}/>
          )
        }) }
      </div>
    </article>
  )
}