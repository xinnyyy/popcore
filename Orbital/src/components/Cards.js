import discussionForum from '../images/discussionforum.png';
import contentRecco from '../images/contentrecco.png';
import trivia from '../images/trivia.png';
import following from '../images/following.png';
import watchLists from '../images/watchlist.png';
import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Features!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            
            <CardItem
              src={discussionForum}
              text='Discussion Forum'
              label='Posts'
              path='/discussionforum'
            />
            <CardItem
              src={contentRecco}
              text='Content Recommendations'
              label='Tailored to your tastes!'
              path='/contentrecco'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src={watchLists}
              text='Watch List'
              label='View your personalised watch list!'
              path='/watchlist'
            />
            <CardItem
              src={trivia}
              text='Trivia'
              label='Test your Knowledge!'
              path='/trivia'
            />
            <CardItem
              src={following}
              text='Followings and Followers'
              label='See what Everyone Else is Up to!'
              path='/following'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
