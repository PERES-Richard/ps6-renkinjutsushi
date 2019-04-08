-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: renkinjutsushi
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `etudiant`
--

DROP TABLE IF EXISTS `etudiant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `etudiant` (
  `idEtudiant` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `photo` blob,
  `promo` varchar(3) NOT NULL DEFAULT 'SI3',
  `specialite` int(11) NOT NULL,
  `commentaire` varchar(255) DEFAULT '',
  `etat` int(11) NOT NULL DEFAULT '1',
  `semestresRestants` int(11) NOT NULL DEFAULT '8',
  `dateDebut` datetime DEFAULT NULL,
  `dateFin` datetime DEFAULT NULL,
  `pays` int(10) unsigned DEFAULT NULL,
  `obtenuVia` varchar(45) DEFAULT '',
  `annee` int(11) NOT NULL DEFAULT '2018',
  PRIMARY KEY (`idEtudiant`),
  KEY `_idx` (`etat`),
  KEY `paysEtu_idx` (`pays`),
  KEY `specialiteEtu_idx` (`specialite`),
  CONSTRAINT `etatEtu` FOREIGN KEY (`etat`) REFERENCES `etat` (`idEtat`),
  CONSTRAINT `paysb` FOREIGN KEY (`pays`) REFERENCES `pays` (`id`),
  CONSTRAINT `specialiteEtu` FOREIGN KEY (`specialite`) REFERENCES `specialite` (`idSpecialite`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etudiant`
--

LOCK TABLES `etudiant` WRITE;
/*!40000 ALTER TABLE `etudiant` DISABLE KEYS */;
INSERT INTO `etudiant` VALUES (1,'Peres','Richard',NULL,'SI3',1,'Le boss',3,0,'2018-05-14 00:00:00','2019-05-14 00:00:00',112,'Contact',2018),(2,'Colomban','Thomas',NULL,'SI4',2,'nulman',2,7,NULL,NULL,4,'',2019),(3,'Sanchez','Ricardo',NULL,'SI5',3,'issou',1,8,NULL,NULL,69,'',2018);
/*!40000 ALTER TABLE `etudiant` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-08 18:37:11
