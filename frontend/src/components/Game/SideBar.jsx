import React from 'react'


const Sidebar = ({ players, currentCategory, difficulty }) => (
    <div className="sidebar">
      <h2>Category</h2>
      <p>{currentCategory}</p>
      <h2>Difficulty</h2>
      <p>{difficulty}</p>
      <h2>Players</h2>
      {players.map(player => (
        <p key={player.id}>{player.name} 
          {
            player.ready && (<span><i className='bi-check' /></span>)
          }
        </p>
      ))}
    </div>
  );

  export default Sidebar;