import AgencyOffering from '../models/AgencyOffering.js';
import Tour from '../models/Tour.js';

export const createOffering = async (req, res) => {
  try {
    const { masterTour, price, seatLimit, boardingPlace, departureTime, comfortLevel } = req.body;
    const agencyId = req.user?.id;

    if (!agencyId) return res.status(401).json({ message: "Unauthorized. Agency ID missing." });

    const newOffering = new AgencyOffering({
      masterTour,
      agency: agencyId,
      price,
      seatLimit,
      boardingPlace,
      departureTime,
      comfortLevel
    });

    const savedOffering = await newOffering.save();

    // Update Master Tour Price if it's the first offering or cheaper
    const tour = await Tour.findById(masterTour);
    let allOfferings = await AgencyOffering.find({ masterTour });
    if (tour && allOfferings.length > 0) {
       const minPrice = Math.min(...allOfferings.map(o => o.price));
       if (tour.price === 0 || tour.price > minPrice || minPrice > 0) {
           tour.price = minPrice;
           await tour.save();
       }
    }

    res.status(201).json({
      success: true,
      message: 'Offering created successfully',
      data: savedOffering
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create offering', error: error.message });
  }
};

export const getOfferingsByRoute = async (req, res) => {
  const masterTourId = req.params.tourId;
  try {
    const offerings = await AgencyOffering.find({ masterTour: masterTourId }).populate('agency', 'username email photo');
    res.status(200).json({
      success: true,
      message: 'Successful',
      count: offerings.length,
      data: offerings
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not found' });
  }
};

export const updateOffering = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedOffering = await AgencyOffering.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    
    // Update Master Tour Price logic
    if (updatedOffering) {
        const tour = await Tour.findById(updatedOffering.masterTour);
        let allOfferings = await AgencyOffering.find({ masterTour: updatedOffering.masterTour });
        if (tour && allOfferings.length > 0) {
           const minPrice = Math.min(...allOfferings.map(o => o.price));
           tour.price = minPrice;
           await tour.save();
        }
    }

    res.status(200).json({ success: true, message: 'Successfully updated', data: updatedOffering });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
};

export const deleteOffering = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedOffering = await AgencyOffering.findByIdAndDelete(id);
    
    // Update Master Tour Price logic if deleted
    if (deletedOffering) {
        const tour = await Tour.findById(deletedOffering.masterTour);
        let allOfferings = await AgencyOffering.find({ masterTour: deletedOffering.masterTour });
        if (tour) {
           if (allOfferings.length > 0) {
               tour.price = Math.min(...allOfferings.map(o => o.price));
           } else {
               tour.price = 0; // Reset if no offerings left
           }
           await tour.save();
        }
    }

    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};

export const getAgencyOfferings = async (req, res) => {
    const agencyId = req.user?.id;
    try {
        const offerings = await AgencyOffering.find({ agency: agencyId }).populate('masterTour', 'title city photo');
        res.status(200).json({
            success: true,
            data: offerings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch' });
    }
}
