import { getError } from "../errors/error.mjs";
import MongoConnection from "../mongo/MongoConnection.mjs"
import bcrypt from 'bcrypt';
export default class AccountsService {
    #accounts
    #connection
    constructor(connection_str, db_name) {
        this.#connection = new MongoConnection(connection_str, db_name);
        this.#accounts = this.#connection.getCollection('accounts');
    }
    async insertAccount(account) {
        await this.#checkAccountExists(account.username, false);
        const toInsertAccount = this.#toAccountDB(account);
        const result = await this.#accounts.insertOne(toInsertAccount);
        if (result.insertedId == account.username) {
            return toInsertAccount;
        }

    }
async getAccount(username) {
    await this.#checkAccountExists(username);
    const account = {};
    account.username = accountDB._id;
    account.email = accountDB.email;
    return account;
}
async updatePassword(account) {
    const accountDB = await this.#accounts.findOne({_id:account.username});
    if(!accountDB) {
        throw getError(404, `account for ${account.username} not found`);
    }
    if(!bcrypt.compareSync(account.password, accountDB.hashPassword)) {
        throw getError(400, `password for ${account.username} is incorrect`);
    }
    const result = await this.#accounts.updateOne({_id:account.username}, {$set:{hashPassword:bcrypt.hashSync(account.newPassword, 10)}});
    if(result.modifiedCount == 0) {
        throw getError(500, `password for ${account.username} not updated`);
    }
    return {message:`password for ${account.username} updated`};
}
async deleteAccount(username) {
    await this.#checkAccountExists(username);
    const result = await this.#accounts.deleteOne({_id:username});
    if(result.deletedCount == 0) {
        throw getError(500, `account for ${username} not deleted`);
    }
    return {message:`account for ${username} deleted`};
}

    #toAccountDB(account) {
        const accountDB = {};
        accountDB._id = account.username;
        accountDB.email = account.email;
        accountDB.hashPassword = bcrypt.hashSync(account.password, 10);
        return accountDB;
    }
    async #checkAccountExists(username, shouldExist = true) {
        const accountDB = await this.#accounts.findOne({ _id: username });
        
        if (shouldExist && !accountDB) {
            throw getError(404, `Account for ${username} not found`);
        }
        
        if (!shouldExist && accountDB) {
            throw getError(400, `Account for ${username} already exists`);
        }
        
        return accountDB;
    }

}