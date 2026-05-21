import { RoleModel, UserModel } from '../../models'

import translate from '../../helpers/translate'
import sendEmail from '../../helpers/send-email'

export const create = async (request, response) => {
    const {
        body: { fullName, email },
    } = request

    const role = await RoleModel.findOne({
        where: { title: 'Admin' },
        attributes: ['id', 'title'],
    })

    const data = await UserModel.create({
        body: {
            email,
            fullName,
            roleId: role?.id,
            roleTitle: role?.title,
            status: 'active',
        },
    })

    await sendEmail('account-activation', data?.email, {
        '{{FULLNAME}}': data?.fullName,
    })

    /* send success response*/
    return response.json({
        message: translate('messages', 'systemUser.success'),
        data,
    })
}
