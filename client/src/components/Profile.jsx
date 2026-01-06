import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import Game from './Game';
const Profile = () => {
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [upcomingGoals, setUpcomingGoals] = useState([]);
  const [goalsById, setGoalsById] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [expandedGoals, setExpandedGoals] = useState({});
  const [gameStatus, setGameStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false); 

  const handleGameEnd = (status) => {
    setGameStatus(status); 
  };

  const fetchGoals = async () => {
    if (userId) {
      try {
        const response = await API.getUserGoals(userId);
        console.log('Obiettivi raggiunti:', response);

        const goalsDetails = await Promise.all(
          response.map((goal) => API.getObjectiveById(goal.goal_id))
        );

        const goalsWithDetails = response.map((goal, index) => ({
          ...goal,
          details: goalsDetails[index],
        }));

        setAchievedGoals(goalsWithDetails);

        const allObjectives = await API.getAllObjectives();
        const achievedGoalIds = response.map((goal) => goal.goal_id);
        const missingGoals = allObjectives.filter(
          (objective) => !achievedGoalIds.includes(objective.id)
        );
        setUpcomingGoals(missingGoals);

      
        if (missingGoals.length > 0) {
          setShowPopup(true); 
        }

      } catch (error) {
        console.error('Error fetching goals:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await API.getUserInfo();
        console.log(user);
        if (user) {
          setUserId(user.id);
          setUsername(user.username);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  
  useEffect(() => {
    if (gameStatus) {
      fetchGoals();
    }
  }, [gameStatus]);

  const toggleGoalDetails = (key) => {
    setExpandedGoals((prevExpandedGoals) => ({
      ...prevExpandedGoals,
      [key]: !prevExpandedGoals[key],
    }));
  };

  const closePopup = () => {
    setShowPopup(false); 
  };

  return (
    <div className="container mt-0">
      <section style={{ marginTop: '5em' }}>
        <h2>Inizia un nuovo gioco!</h2>
        <Game onGameEnd={handleGameEnd} />
        
      </section>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Nuovi obiettivi sbloccati!</h3>
            <button onClick={closePopup}>Chiudi</button>
          </div>
        </div>
      )}

      <section>
        <h2 style={{ marginTop: '40px' }}>Obiettivi raggiunti</h2>
        {achievedGoals.length > 0 ? (
          <ul className="list-group">
            {achievedGoals.map((goal) => {
              const key = `achieved-${goal.id}`;
              return (
                <li key={goal.id} className="list-group-item">
                  <p
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => toggleGoalDetails(key)}
                  >
                    {goal.details.name}
                  </p>
                  {expandedGoals[key] && (
                    <div className="mt-3">
                      <p>{goal.details.description}</p>
                      <p>
                        Raggiunto {goal.count === 1 ? `${goal.count} volta` : `${goal.count} volte`}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Non hai ancora raggiunto alcun obiettivo!</p>
        )}
      </section>

      <section className="mb-4">
        <h2>Prossimi obiettivi</h2>
        {upcomingGoals.length > 0 ? (
          <ul className="list-group">
            {upcomingGoals.map((goal) => {
              const key = `upcoming-${goal.id}`;
              return (
                <li key={goal.id} className="list-group-item">
                  <p
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => toggleGoalDetails(key)}
                  >
                    {goal.name}
                  </p>
                  {expandedGoals[key] && (
                    <div className="mt-3">
                      <p> {goal.description}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Continua a giocare per sbloccare nuovi obiettivi!</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
