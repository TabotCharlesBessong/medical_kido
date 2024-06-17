import { Request, Response } from "express";
import PatientService from "../services/patient.service";
import { ResponseCode } from "../interfaces/enum/code.enum";
import Utility from "../utils/index.utils";
import { IPatient } from "../interfaces/patient.interface";
// import AppointmentService from "../services/appointment.service";

class PatientController {
  private patientService: PatientService;
  // private appointmentService: AppointmentService;

  constructor(_patientService: PatientService) {
    this.patientService = _patientService;
  }

  async createPatient(req: Request, res: Response) {
    try {
      const params = { ...req.body };
      const newPatient = {
        userId: params.user.id,
        age: params.age,
        gender: params.gender,
      };

      // checkign if the patient already exist
      let patientExists = await this.patientService.getPatientById(
        newPatient.userId
      );
      if (patientExists)
        return Utility.handleError(
          res,
          "We are sorry but you have already created a patient account",
          ResponseCode.ALREADY_EXIST
        );
      const patient = await this.patientService.createPatient(newPatient);
      return Utility.handleSuccess(
        res,
        "Patient Info created successfully",
        { patient },
        ResponseCode.SUCCESS
      );
    } catch (error) {
      res
        .status(ResponseCode.SERVER_ERROR)
        .json({ message: (error as TypeError).message });
    }
  }

  async getPatientById(req: Request, res: Response) {
    try {
      const patient = await this.patientService.getPatientById(
        req.params.userId
      );
      if (!patient)
        return Utility.handleError(
          res,
          "Could not get patient",
          ResponseCode.NOT_FOUND
        );
      else
        return Utility.handleSuccess(
          res,
          "Account fetched successfully",
          { patient },
          ResponseCode.SUCCESS
        );
    } 
    catch (error) {
      return Utility.handleError(
        res,
        (error as TypeError).message,
        ResponseCode.SERVER_ERROR
      );
    }
  }

  async updatePatient(req: Request, res: Response) {
    try {
      const patientId = req.params.userId;
      const data = { ...req.body };
      const patient = await this.patientService.updatePatient(patientId, data);
      return Utility.handleSuccess(
        res,
        "Post updated successfully",
        { patient },
        ResponseCode.SUCCESS
      );
    } catch (error) {
      return Utility.handleError(
        res,
        (error as TypeError).message,
        ResponseCode.SERVER_ERROR
      );
    }
  }
}

export default PatientController;