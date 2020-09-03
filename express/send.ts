import { Service } from "../generated/serve/services/Service";

/**
* Send some amount to a given address
*
* sendRequest List place a send request
* returns SendResponse
* */
export const send = ({ sendRequest }) => new Promise(
    async (resolve, reject) => {
      try {
        resolve(Service.successResponse({
          sendRequest,
        }));
      } catch (e) {
        reject(Service.rejectResponse(
          e.message || "Invalid input",
          e.status || 405,
        ));
      }
    },
  );