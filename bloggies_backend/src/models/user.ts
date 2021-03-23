import db from "../db";
import ExpressError from "../expressError";
import { ACTIVE, INACTIVE } from "../membershipStatuses";

export default class User {

  /** Create a new user */
  static async createUser(userId: number, displayName: string) {
    try {
      const res = await db.query(
        `INSERT INTO users (user_id, display_name)
        VALUES ($1, $2)
        RETURNING display_name, membership_status, membership_start_date, membership_end_date,
        last_submission_date`,
        [userId, displayName]);
      return res.rows[0];
    } catch (err) {
      throw new ExpressError('Display name is already taken.', 400)
    }
  }

  /** Get specific user from database */
  static async getUser(userId: number) {
    const res = await db.query(
      `SELECT user_id AS id, display_name, membership_status, membership_start_date, membership_end_date, last_submission_date
        FROM users
        WHERE user_id = $1`,
      [userId]);
    return res.rows[0];
  }

  /** Get the last_submission_date for specific user from database */
  static async getLastSubmissionDate(userId: number) {
    const res = await db.query(
      `SELECT last_submission_date
        FROM users
        WHERE user_id = $1`,
      [userId]);
    return res.rows[0].last_submission_date;
  }

  static async searchUsers(term: string) {
    const res = await db.query(
      `SELECT user_id AS id, display_name, last_submission_date
        FROM users
        WHERE LOWER(display_name) LIKE LOWER('%' || $1 || '%')`,
      [term]);
    return res.rows;
  }

  /** Return the membership status of a given user */
  static async checkMembershipStatus(userId: number) {
    const res = await db.query(
      `SELECT membership_status
      FROM users
      WHERE user_id = $1`,
      [userId]
    );
    return res.rows[0];
  }

  /** Update the membership status after the application is complete and front end sends the status */
  /** If status has been changed to "active", update membership start date and end date */
  static async updateMembership(user_id: number, appStatus: string) {
    const now = appStatus === ACTIVE ? new Date() : null;
    let membershipExpiration = null;
    if(now) {
      membershipExpiration = new Date();
      membershipExpiration.setMonth(now.getMonth() + 1);
    }
    const res = await db.query(
      `UPDATE users
        SET membership_status = $1, membership_start_date = $2, membership_end_date = $3
        WHERE user_id = $4
        RETURNING user_id, membership_status, membership_start_date, membership_end_date`,
        [appStatus, now, membershipExpiration, user_id]);
    return res.rows[0];
  }

  /** Update an existing user */
  static async updateUser(id: number, updateData: any) {
    try {
      let query = "";

      for (let key in updateData) {
        query = query + ` ${key} = '${updateData[key]}', `;
      }

      await db.query(
        `UPDATE users
        SET ${query}  
        WHERE user_id = $1`,
        [id]);
    } catch (err) {
      throw new ExpressError(`Err: ${err}`, 400);
    }
  }

  /** Sets membership_status to INACTIVE. Sets membership_end_date 
   * to CURRENT_TIMESTAMP. via subscription id */
  static async cancelSubscription(subscriptionId: string) {
    await db.query(
      `UPDATE users 
      SET membership_status = $2, membership_end_date = $3
      WHERE subscription_id = $1`,
      [subscriptionId, INACTIVE, Date.now()]);
  }

  //checks that the display_name given at registration doesn't already exist before adding it
  static async checkForUniqueDisplayName(display_name: string) {
      const res = await db.query(
        `SELECT display_name
        FROM users
        WHERE display_name = $1`, 
        [display_name]
      );
    return res.rows[0];
  }
}