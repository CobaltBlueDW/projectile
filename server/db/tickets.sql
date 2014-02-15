-- phpMyAdmin SQL Dump
-- version 4.0.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 15, 2014 at 11:45 AM
-- Server version: 5.5.30
-- PHP Version: 5.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `projectile`
--

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE IF NOT EXISTS `tickets` (
  `ticketID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `projectName` varchar(32) NOT NULL,
  `ticketNumber` varchar(32) NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `priority` varchar(32) DEFAULT NULL,
  `resolution` varchar(32) DEFAULT NULL,
  `description` text,
  `revenueStream` varchar(255) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`ticketID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticketID`, `projectName`, `ticketNumber`, `status`, `priority`, `resolution`, `description`, `revenueStream`, `data`) VALUES
(1, 'WCW', '400', 'Closed', 'Major', 'Fixed', 'WADA LMS access', '   CourseStage:Broadway-Release', '{}'),
(2, 'AHIP', '1500', 'Closed', 'Major', 'Won&#39;t Fix', 'Bleuprint/Estimate Creating a Letter Filter', '', '{}'),
(3, 'CHEC', '100', 'Closed', 'Major', 'Fixed', 'Please reset users activity and grades in Oregon&#39;s It&#39;s Up 2U course', '', '{}'),
(4, 'ACRP', '1', 'Closed', 'Major', 'Fixed', 'ACRP Universal - Deliverables for LMS &amp; eCourses', '', '{}'),
(5, 'SCP', '1000', 'Closed', 'Major', 'Fixed', 'Physiology &amp; Health - Edit Unit 8 contents from Proofing', '', '{}'),
(6, 'WCW', '401', 'Resolved', 'Major', 'Fixed', 'Add Designator video to Documentation', '', '{}'),
(7, 'SCP', '1001', 'Closed', 'Major', 'Fixed', 'Physiology &amp; Health - Edit Unit 9 contents from Proofing', '', '{}'),
(8, 'CSTAGE', '3000', 'Resolved', 'Major', 'Fixed', 'Learning Plan Permissions', '', '{"redirect":"CSQA-38"}'),
(9, 'AHIP', '1501', 'Closed', 'Major', 'Fixed', 'Blueprint/estimate increasing gradebook performance', '', '{"redirect":"CSTAGE-3282"}'),
(10, 'CHEC', '101', 'Closed', 'Major', 'Won&#39;t Fix', 'Interaction report exports all interactions in Moodle for student; rather than just for the course', '', '{}'),
(11, 'CHEC', '102', 'Closed', 'Major', 'Fixed', 'Upload SCORM Packages for New CHEC Courses', '', '{}'),
(12, 'WCW', '402', 'Open', 'Major', 'Unresolved', 'Update template to create XML', '', '{}'),
(13, 'SCP', '1002', 'Closed', 'Major', 'Fixed', 'Items needed on NAHB Staging Site &amp; Move Live for CSP Release', '', '{}'),
(14, 'AHIP', '1502', 'Closed', 'Major', 'Won&#39;t Fix', 'Blueprint/Estimate making changes to Certificate of Completion', '', '{}'),
(15, 'AHIP', '1503', 'Closed', 'Major', 'Fixed', 'Fix bug that on &quot;account delete&quot; the NPN gets freed', '', '{}'),
(16, 'ACRP', '2', 'Closed', 'Major', 'Fixed', 'ACRP Look of Success Branding Guidelines &amp; Mock-ups', '', '{}'),
(17, 'CHEC', '103', 'Resolved', 'Major', 'Fixed', 'Upload SCORM Packages for Revised CHEC Course: Drug Defense', '', '{}'),
(18, 'AHIP', '1504', 'Closed', 'Major', 'Fixed', 'remove calltime pass by reference from editadvanced', '', '{}'),
(19, 'ACRP', '3', 'Closed', 'Major', 'Fixed', 'ACRP Technical Specifications', '', '{}'),
(20, 'AHIP', '1505', 'Closed', 'Major', 'Fixed', 'User report will not download from AHIP hub', '', '{}'),
(21, 'CHEC', '104', 'Closed', 'Major', 'Fixed', 'Upload new SCORM Package for DD Preview', '', '{}'),
(22, 'CSTAGE', '3001', 'Resolved', 'Major', 'Fixed', 'Refactor learning plan notifications', '', '{}'),
(23, 'ACRP', '4', 'Closed', 'Major', 'Fixed', 'ACRP Instructional Design Guidelines', '', '{}'),
(24, 'SCP', '1003', 'Closed', 'Major', 'Fixed', 'SunDB Welcome emails are not sending out on consecutive cron run', '', '{}'),
(25, 'CSTAGE', '3002', 'Resolved', 'Major', 'Cannot Reproduce', 'Learning Plans &amp; Hierarchy', '', '{"redirect":"CSQA-39"}'),
(26, 'CHEC', '105', 'Closed', 'Major', 'Won&#39;t Fix', 'Create a new report that compiles raw interaction data for a course across all districts', '', '{}'),
(27, 'AHIP', '1506', 'Closed', 'Major', 'Fixed', 'CIEPD Final Exam throws error', '', '{"redirect":"CSTAGE-3172"}'),
(28, 'AHIP', '1507', 'Closed', 'Major', 'Fixed', 'Pricing - New Hire Workstations', '', '{}');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
