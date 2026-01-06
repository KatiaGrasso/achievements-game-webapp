export default function Game(id, user_id, difficulty, attempts = 0, secret_number, game_status = 'in_progress') {
    this.id = id;
    this.user_id = user_id;
    this.difficulty = difficulty;
    this.attempts = attempts;
    this.secret_number = secret_number
    this.game_status = game_status;

    this.toJSON = () => {
        return {
            ...this,
        };
    };
}