const Scheme = require('../models/Scheme');
const memoryStore = require('../utils/memoryStore');
const seedData = require('../utils/seedData');
const mongoose = require('mongoose');

const checkEligibility = async (req, res, next) => {
  try {
    const {
      age,
      state = 'All India',
      occupation = '',
      annualIncome = null,
      isFarmer = false,
      gender = 'All',
      schemeId = null,
    } = req.body;

    let schemesToEvaluate = [];
    if (mongoose.connection.readyState === 1) {
      if (schemeId) {
        const found = await Scheme.findById(schemeId);
        if (found) schemesToEvaluate = [found];
      } else {
        schemesToEvaluate = await Scheme.find({ verificationStatus: 'verified' });
      }
    } else {
      const source = memoryStore.schemes.length > 0 ? memoryStore.schemes : seedData.schemes;
      if (schemeId) {
        const found = source.find((s) => s._id === schemeId || s.slug === schemeId);
        if (found) schemesToEvaluate = [found];
      } else {
        schemesToEvaluate = source;
      }
    }

    const numericAge = age !== undefined && age !== null ? Number(age) : null;
    const numericIncome = annualIncome !== undefined && annualIncome !== null ? Number(annualIncome) : null;

    const results = schemesToEvaluate.map((scheme) => {
      const criteria = scheme.eligibility || {};
      const reasons = [];
      const missingCriteria = [];
      let isEligible = true;

      // 1. Age Check
      if (numericAge !== null) {
        if (criteria.minAge && numericAge < criteria.minAge) {
          isEligible = false;
          missingCriteria.push(`Minimum age required is ${criteria.minAge} years (Applicant is ${numericAge})`);
        } else if (criteria.maxAge && numericAge > criteria.maxAge) {
          isEligible = false;
          missingCriteria.push(`Maximum age limit is ${criteria.maxAge} years (Applicant is ${numericAge})`);
        } else {
          reasons.push(`Meets age criterion (${criteria.minAge || 0} - ${criteria.maxAge || 'Any'} years)`);
        }
      }

      // 2. State Check
      if (state && state !== 'All India' && criteria.applicableStates && criteria.applicableStates.length > 0) {
        const isStateCovered =
          criteria.applicableStates.includes('All India') ||
          criteria.applicableStates.includes(state);

        if (!isStateCovered) {
          isEligible = false;
          missingCriteria.push(`Applicable only in: ${criteria.applicableStates.join(', ')} (Applicant is from ${state})`);
        } else {
          reasons.push(`Applicable in your state (${state})`);
        }
      }

      // 3. Gender Check
      if (gender && criteria.gender && criteria.gender !== 'All' && gender !== 'All') {
        if (criteria.gender !== gender) {
          isEligible = false;
          missingCriteria.push(`Reserved exclusively for ${criteria.gender} applicants`);
        } else {
          reasons.push(`Meets gender criterion (${criteria.gender})`);
        }
      }

      // 4. Farmer Status Check
      if (criteria.isFarmerOnly) {
        if (!isFarmer && !occupation.toLowerCase().includes('farm') && !occupation.toLowerCase().includes('kisan')) {
          isEligible = false;
          missingCriteria.push('Exclusively for farming/cultivator households');
        } else {
          reasons.push('Meets agricultural/farmer criteria');
        }
      }

      // 5. Income Check
      if (numericIncome !== null && criteria.maxIncome) {
        if (numericIncome > criteria.maxIncome) {
          isEligible = false;
          missingCriteria.push(`Annual income must be below ₹${criteria.maxIncome.toLocaleString('en-IN')} (Declared: ₹${numericIncome.toLocaleString('en-IN')})`);
        } else {
          reasons.push(`Income within permitted limit (Max: ₹${criteria.maxIncome.toLocaleString('en-IN')})`);
        }
      }

      // 6. Occupation specific check (e.g. Vishwakarma)
      if (criteria.occupations && criteria.occupations.length > 0 && occupation) {
        const matchesOccupation = criteria.occupations.some((occ) =>
          occupation.toLowerCase().includes(occ.toLowerCase())
        );
        if (matchesOccupation) {
          reasons.push(`Matched recognized trade: ${occupation}`);
        }
      }

      return {
        schemeId: scheme._id || scheme.slug,
        schemeName: scheme.name,
        category: scheme.category,
        isPotentiallyEligible: isEligible,
        criteriaText: criteria.criteriaText,
        satisfiedCriteria: reasons,
        missingCriteria,
        requiredDocuments: scheme.requiredDocuments || [],
        officialUrl: scheme.officialUrl,
        helpline: scheme.helpline || '',
        disclaimer: 'This is preliminary digital guidance, not an official sanction. Final approval is subject to document scrutiny by the designated government authority.',
      };
    });

    const eligibleSchemes = results.filter((r) => r.isPotentiallyEligible);
    const inEligibleSchemes = results.filter((r) => !r.isPotentiallyEligible);

    res.status(200).json({
      success: true,
      assessment: {
        totalEvaluated: results.length,
        eligibleCount: eligibleSchemes.length,
        eligibleSchemes,
        inEligibleSchemes: inEligibleSchemes.slice(0, 5),
        disclaimer: 'Preliminary automated guidance. Please verify at your local Gram Panchayat / CSC or official portal.',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkEligibility };
