import { PencilLine } from 'phosphor-react';
import { Avatar } from '../Avatar';
import styles from './styles.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <img 
        className={styles.cover}
        src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=50"/>
    
    <div className={styles.profile}>
      <Avatar hasBorder src="https://github.com/debfdias.png"/>
      <strong>Debs FD</strong>
      <span>Fullstask Dev</span>
    </div>

    <footer>
      <a href="#">
        <PencilLine size={20} />
        Edit profile
      </a>
    </footer>
    
    </aside>
  )
}