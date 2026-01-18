import { BaseService } from "./_utils";
import { ActivitiesModel, TagsActivities } from "~/model";

export class ActivitiesService extends BaseService {

  async createActivity() {
    const { db, user, getForm } = this;

    const form = await getForm();

    const started_at = form.getString("started_at");
    const ended_at = form.getString("ended_at");

    const { data: activity, error } = await ActivitiesModel.create({
      db,
      started_at,
      ended_at,
    });

    if (error) {
      console.warn(error);
      
      return { data: undefined, error };
    }

    const tags = form.getArray("tags");

    await Promise.all(
      tags.map((tag_id) =>
        TagsActivities.create({ db, tag_id, activity_id: activity.id })
      )
    );

    return await ActivitiesModel.getById({
      db,
      user,
      activityId: activity.id,
    });
  }

  async getActivityList() {
    const { db, user } = this;

    return await ActivitiesModel.getList({ db, user });
  }

  async getActivityById(activityId: string) {
    const { db, user } = this;

    return await ActivitiesModel.getById({ db, user, activityId });
  }

}