import User from '../models/User';

export default {
    render(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
        }
    },

    renderMany(orphanages: User[]) {
        return orphanages.map( user => this.render(user));
    }
}