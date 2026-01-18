import { BaseService } from "./_utils";
import { ActivitiesModel, TagsActivities } from "~/model";

export class ActivitiesService extends BaseService {

  async createActivity() {
    const { db, user, getForm } = this;

    const form = await getForm();

    const started_at = form.getString("started_at");
    const ended_at = form.getString("ended_at");

    const { data: _activity, error: _error } = await ActivitiesModel.create({
      db,
      started_at,
      ended_at,
    });

    if (_error) {
      console.warn(_error);
      
      return { activity: _activity, error: _error };
    }

    const tags = form.getArray("tags");

    await Promise.all(
      tags.map((tag_id) =>
        TagsActivities.create({ db, tag_id, activity_id: _activity.id })
      )
    );

    const { data: activity, error } = await ActivitiesModel.getById({
      db,
      user,
      activityId: _activity.id,
    });

    if (error) {
      return { error, activity };
    }

    return { error, activity };
  }

  async getActivityList() {
    const { db, user } = this;

    const { data: activities, error } =  await ActivitiesModel.getList({
      db,
      user
    });

    if (error) {
      return { activities, error };
    }

    return { activities, error };
  }

  async getActivityById(activityId: string) {
    const { db, user } = this;

    const { data: activity, error } = await ActivitiesModel.getById({
      db,
      user,
      activityId
    });

    if (error) {
      return { activity, error };
    }

    return { activity, error };
  }

}