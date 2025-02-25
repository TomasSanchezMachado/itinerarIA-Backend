import { Response, Request, NextFunction } from "express";
import { ObjectId } from "@mikro-orm/mongodb";
import { orm } from "../shared/db/orm.js";
import { User } from "../user/user.entity.js";
import { Activity } from "../activity/activity.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";
import { Opinion } from "../opinion/opinion.entity.js";
import { Participant } from "../participant/participant.entity.js";
import { Place } from "../place/place.entity.js";
import { Preference } from "../preference/preference.entity.js";
import { ExternalService } from "../externalService/externalService.entity.js";


const em = orm.em;

export async function deleteData(req: Request, res: Response) {
    try {
        await em.nativeDelete(User, {});
        await em.nativeDelete(Activity, {});
        await em.nativeDelete(Itinerary, {});
        await em.nativeDelete(Opinion, {});
        await em.nativeDelete(Participant, {});
        await em.nativeDelete(Place, {});
        await em.nativeDelete(Preference, {});
        await em.nativeDelete(ExternalService, {});

      res.status(200).send({ message: "Data deleted successfully" });
    } catch (error: any) {
      return res.status(500).send({ message: error.message });
    }
  }