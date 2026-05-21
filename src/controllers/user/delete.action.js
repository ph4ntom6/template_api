import { UserModel } from '../../models'

import translate from '../../helpers/translate'

/* Delete User
 * @description This method will delete a user and update its email
 */
export const deleteUser = async (request, response) => {
    const { user } = request

    await UserModel.updateByPk(user?.id, {
        body: {
            email: `${user?.id}-${user?.email}`,
        },
    })

    await UserModel.destroy({
        where: {
            id: user?.id,
        },
    })

    /* send response */
    return response.json({
        message: translate('messages', 'delete', {
            ':attribute': 'User has',
            ':action': 'deleted',
        }),
    })
}
