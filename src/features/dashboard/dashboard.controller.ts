import { Request,Response,NextFunction } from "express";
import { dashboardService } from "./dashboard.service";

 const GetDashboardController = async(req: Request, res: Response, next: NextFunction)=> {
  try {
      const dashboardOverview = await dashboardService.dashboardOverview()
      
       res.status(200).json({
            status: "Success",
            code: 200,
            data: dashboardOverview,
            message: "Get dashboard overview successful",
        })

  } catch (error) {
    next(error)
  }   
}

export const dashboardController = {
    GetDashboardController
}